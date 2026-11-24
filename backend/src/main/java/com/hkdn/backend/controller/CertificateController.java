package com.hkdn.backend.controller;

import com.hkdn.backend.dto.CertificateCreateRequest;
import com.hkdn.backend.dto.CertificateResponse;
import com.hkdn.backend.dto.CertificateUpdateRequest;
import com.hkdn.backend.dto.RevokeCertificateRequest;
import com.hkdn.backend.entity.CertificateStatus;
import com.hkdn.backend.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

 private final CertificateService service;

 public CertificateController(CertificateService service) {
  this.service = service;
 }

 @GetMapping("/my")
 @PreAuthorize("isAuthenticated()")
 public Page<CertificateResponse> myCertificates(@AuthenticationPrincipal Jwt jwt, Pageable pageable) {
  String email = jwt.getClaimAsString("email");
  if (email == null || email.isBlank()) {
   email = jwt.getClaimAsString("preferred_username");
  }
  return service.myCertificates(email, pageable).map(CertificateResponse::from);
 }

 @GetMapping
 @PreAuthorize("hasAnyRole('ADMIN','ISSUER')")
 public Page<CertificateResponse> list(
         @RequestParam(required = false) String q,
         @RequestParam(required = false) CertificateStatus status,
         Pageable pageable
 ) {
  return service.list(q, status, pageable).map(CertificateResponse::from);
 }

 @GetMapping("/{id}")
 @PreAuthorize("isAuthenticated()")
 public CertificateResponse get(@PathVariable UUID id) {
  return CertificateResponse.from(service.get(id));
 }

 @GetMapping("/code/{code}")
 @PreAuthorize("isAuthenticated()")
 public CertificateResponse getByCode(@PathVariable String code) {
  return CertificateResponse.from(service.getByCode(code));
 }

 @PostMapping
 @PreAuthorize("hasAnyRole('ADMIN','ISSUER')")
 public CertificateResponse create(@Valid @RequestBody CertificateCreateRequest r, @AuthenticationPrincipal Jwt jwt) {
  return CertificateResponse.from(service.create(r, UUID.fromString(jwt.getSubject())));
 }

 @PutMapping("/{id}")
 @PreAuthorize("hasAnyRole('ADMIN','ISSUER')")
 public CertificateResponse update(@PathVariable UUID id, @Valid @RequestBody CertificateUpdateRequest r) {
  return CertificateResponse.from(service.update(id, r));
 }

 @PostMapping("/{id}/issue")
 @PreAuthorize("hasAnyRole('ADMIN','ISSUER')")
 public CertificateResponse issue(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
  return CertificateResponse.from(service.issue(id, UUID.fromString(jwt.getSubject())));
 }

 @PostMapping("/{id}/revoke")
 @PreAuthorize("hasAnyRole('ADMIN','ISSUER')")
 public CertificateResponse revoke(@PathVariable UUID id, @Valid @RequestBody RevokeCertificateRequest r) {
  return CertificateResponse.from(service.revoke(id, r));
 }
}