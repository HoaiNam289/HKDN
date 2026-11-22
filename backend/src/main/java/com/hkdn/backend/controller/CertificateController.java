package com.hkdn.backend.controller;
import com.hkdn.backend.dto.*;import com.hkdn.backend.entity.*;import com.hkdn.backend.service.CertificateService;import jakarta.validation.Valid;import org.springframework.data.domain.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.security.oauth2.jwt.Jwt;import org.springframework.security.core.annotation.AuthenticationPrincipal;import org.springframework.web.bind.annotation.*;import java.util.UUID;
@RestController @RequestMapping("/api/certificates") @PreAuthorize("hasAnyRole('ADMIN','ISSUER')") public class CertificateController {
 private final CertificateService service; public CertificateController(CertificateService service){this.service=service;}
 @PostMapping public Certificate create(@Valid @RequestBody CertificateCreateRequest r,@AuthenticationPrincipal Jwt jwt){return service.create(r,UUID.fromString(jwt.getSubject()));}
 @GetMapping public Page<Certificate> list(@RequestParam(required=false) String q,@RequestParam(required=false) CertificateStatus status,Pageable pageable){return service.list(q,status,pageable);}
 @GetMapping("/{id}") public Certificate get(@PathVariable UUID id){return service.get(id);}
 @PutMapping("/{id}") public Certificate update(@PathVariable UUID id,@Valid @RequestBody CertificateUpdateRequest r){return service.update(id,r);}
 @PostMapping("/{id}/issue") public Certificate issue(@PathVariable UUID id,@AuthenticationPrincipal Jwt jwt){return service.issue(id,UUID.fromString(jwt.getSubject()));}
 @PostMapping("/{id}/revoke") public Certificate revoke(@PathVariable UUID id,@Valid @RequestBody RevokeCertificateRequest r){return service.revoke(id,r);}
}
