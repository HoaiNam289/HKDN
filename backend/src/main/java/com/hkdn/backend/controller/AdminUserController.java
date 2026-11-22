package com.hkdn.backend.controller;
import com.hkdn.backend.dto.*;import com.hkdn.backend.service.UserManagementService;import jakarta.validation.Valid;import org.springframework.data.domain.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.security.core.annotation.AuthenticationPrincipal;import org.springframework.security.oauth2.jwt.Jwt;import org.springframework.web.bind.annotation.*;import java.util.UUID;
@RestController @RequestMapping("/api/admin/users") @PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
 private final UserManagementService service; public AdminUserController(UserManagementService service){this.service=service;}
 @PostMapping public UserResponse create(@Valid @RequestBody UserCreateRequest request){return service.create(request);}
 @GetMapping public Page<UserResponse> list(@RequestParam(required=false) String q,@RequestParam(required=false) String role,@RequestParam(required=false) String status,Pageable pageable){return service.search(q,role,status,pageable);}
 @GetMapping("/{id}") public UserResponse get(@PathVariable UUID id){return service.get(id);}
 @PatchMapping("/{id}") public UserResponse update(@PathVariable UUID id,@Valid @RequestBody UserUpdateRequest request,@AuthenticationPrincipal Jwt jwt){return service.update(id,request,UUID.fromString(jwt.getSubject()));}
 @PostMapping("/{id}/reset-password") public void reset(@PathVariable UUID id,@Valid @RequestBody ResetPasswordRequest request){service.resetPassword(id,request);}
}
