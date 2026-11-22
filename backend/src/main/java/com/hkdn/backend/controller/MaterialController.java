package com.hkdn.backend.controller;
import com.hkdn.backend.dto.*;import com.hkdn.backend.entity.*;import com.hkdn.backend.service.MaterialService;import jakarta.validation.Valid;import org.springframework.core.io.ByteArrayResource;import org.springframework.data.domain.*;import org.springframework.http.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.security.oauth2.jwt.Jwt;import org.springframework.security.core.annotation.AuthenticationPrincipal;import org.springframework.web.bind.annotation.*;import org.springframework.web.multipart.MultipartFile;import java.util.*;
@RestController @RequestMapping("/api/materials") public class MaterialController {
 private final MaterialService service;public MaterialController(MaterialService service){this.service=service;}
 @PostMapping @PreAuthorize("hasAnyRole('ADMIN','ISSUER')") public Material create(@Valid @RequestBody MaterialCreateRequest r,@AuthenticationPrincipal Jwt jwt){return service.create(r,UUID.fromString(jwt.getSubject()));}
 @GetMapping public Page<Material> list(@RequestParam(required=false) String q,Pageable p){return service.list(q,p);}
 @GetMapping("/{id}") public Material get(@PathVariable UUID id){return service.get(id);}
 @PatchMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','ISSUER')") public Material update(@PathVariable UUID id,@Valid @RequestBody MaterialUpdateRequest r){return service.update(id,r);}
 @PostMapping(value="/{id}/versions",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) @PreAuthorize("hasAnyRole('ADMIN','ISSUER')") public MaterialVersion upload(@PathVariable UUID id,@RequestPart("file") MultipartFile file,@AuthenticationPrincipal Jwt jwt){return service.upload(id,file,UUID.fromString(jwt.getSubject()));}
 @GetMapping("/{id}/versions") public List<MaterialVersion> versions(@PathVariable UUID id){return service.versions(id);}
 @GetMapping("/versions/{versionId}/download") public ResponseEntity<ByteArrayResource> download(@PathVariable UUID versionId){var f=service.download(versionId);return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+f.version().getOriginalFilename().replace("\"","_")+"\"").contentLength(f.bytes().length).body(new ByteArrayResource(f.bytes()));}
 @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','ISSUER')") public void archive(@PathVariable UUID id){service.archive(id);}
}
