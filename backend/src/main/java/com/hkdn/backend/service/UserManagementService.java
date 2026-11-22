package com.hkdn.backend.service;

import com.hkdn.backend.dto.*;
import com.hkdn.backend.entity.*;
import com.hkdn.backend.exception.*;
import com.hkdn.backend.repository.*;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserManagementService {
    private final UserRepository users; private final RoleRepository roles; private final PasswordEncoder encoder;
    public UserManagementService(UserRepository users,RoleRepository roles,PasswordEncoder encoder){this.users=users;this.roles=roles;this.encoder=encoder;}
    @Transactional public UserResponse create(UserCreateRequest request){String email=normalize(request.email());if(users.existsByEmailIgnoreCase(email))throw new ConflictException("Email is already registered");User user=User.create(email,encoder.encode(request.password()),request.fullName().trim());user.setRoles(resolveRoles(request.roles()));return map(users.save(user));}
    @Transactional public UserResponse register(RegisterRequest request){String email=normalize(request.email());if(users.existsByEmailIgnoreCase(email))throw new ConflictException("Email is already registered");User user=User.create(email,encoder.encode(request.password()),request.fullName().trim());Role student=roles.findByCode("STUDENT").orElseThrow(()->new BusinessException("STUDENT role is not configured"));user.setRoles(new LinkedHashSet<>(Set.of(student)));return map(users.save(user));}
    @Transactional(readOnly=true) public Page<UserResponse> search(String query, String role, String status, Pageable pageable){String q=query==null?"":query.trim();String normalizedRole=role==null||role.isBlank()?null:role.trim().toUpperCase(Locale.ROOT);String normalizedStatus=status==null||status.isBlank()?null:status.trim().toUpperCase(Locale.ROOT);if(normalizedRole!=null&&!Set.of("ADMIN","ISSUER","STUDENT").contains(normalizedRole))throw new BusinessException("Unsupported role filter");if(normalizedStatus!=null&&!Set.of("ACTIVE","INACTIVE").contains(normalizedStatus))throw new BusinessException("Unsupported status filter");return users.searchAdminUsers(q,normalizedRole,normalizedStatus,pageable).map(this::map);}
    @Transactional(readOnly=true) public UserResponse get(UUID id){return map(find(id));}
    @Transactional public UserResponse update(UUID id,UserUpdateRequest request,UUID actorId){User user=find(id);String email=normalize(request.email());if(!email.equalsIgnoreCase(user.getEmail())&&users.existsByEmailIgnoreCase(email))throw new ConflictException("Email is already registered");Set<Role> requestedRoles=request.roles()==null?user.getRoles():resolveRoles(request.roles());if(requestedRoles.isEmpty())throw new BusinessException("A user must have at least one role");boolean targetAdmin=hasRole(user,"ADMIN");boolean keepsAdmin=hasRole(requestedRoles,"ADMIN");boolean disabling=Boolean.FALSE.equals(request.enabled())||Boolean.TRUE.equals(request.locked());if(user.getId().equals(actorId)&&(disabling||targetAdmin&&!keepsAdmin))throw new BusinessException("You cannot disable, lock, or remove ADMIN from your own account");if(targetAdmin&&(!keepsAdmin||disabling)&&users.countByRoleCode("ADMIN")<=1)throw new BusinessException("The last ADMIN account cannot be disabled or demoted");user.setEmail(email);user.setFullName(request.fullName().trim());if(request.enabled()!=null)user.setEnabled(request.enabled());if(request.locked()!=null)user.setLocked(request.locked());user.setRoles(requestedRoles);return map(user);}
    @Transactional public void resetPassword(UUID id,ResetPasswordRequest request){find(id).setPasswordHash(encoder.encode(request.newPassword()));}
    @Transactional public void changePassword(UUID id,ChangePasswordRequest request){User user=find(id);if(!encoder.matches(request.currentPassword(),user.getPasswordHash()))throw new BusinessException("Current password is incorrect");user.setPasswordHash(encoder.encode(request.newPassword()));}
    public User find(UUID id){return users.findWithRolesById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));}
    private Set<Role> resolveRoles(Set<String> codes){Set<Role> result=new LinkedHashSet<>();for(String raw:codes){String code=raw.trim().toUpperCase(Locale.ROOT);result.add(roles.findByCode(code).orElseThrow(()->new ResourceNotFoundException("Role not found: "+code)));}return result;}
    private boolean hasRole(User user,String code){return user.getRoles().stream().anyMatch(role->code.equals(role.getCode()));}
    private boolean hasRole(Set<Role> roleSet,String code){return roleSet.stream().anyMatch(role->code.equals(role.getCode()));}
    private String normalize(String email){return email.trim().toLowerCase(Locale.ROOT);}
    private UserResponse map(User u){return new UserResponse(u.getId(),u.getEmail(),u.getFullName(),u.isEnabled(),u.isLocked(),u.getCreatedAt(),u.getUpdatedAt(),u.getRoles().stream().map(r->new RoleResponse(r.getId(),r.getCode(),r.getName())).collect(Collectors.toCollection(LinkedHashSet::new)));}
}
