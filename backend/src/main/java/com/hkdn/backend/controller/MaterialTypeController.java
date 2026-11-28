package com.hkdn.backend.controller;

import com.hkdn.backend.dto.MaterialTypeRequest;
import com.hkdn.backend.dto.MaterialTypeResponse;
import com.hkdn.backend.service.MaterialTypeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/material-types")
public class MaterialTypeController {

    private final MaterialTypeService service;

    public MaterialTypeController(MaterialTypeService service) {
        this.service = service;
    }

    @GetMapping
    public Page<MaterialTypeResponse> list(@RequestParam(required = false) String q, Pageable pageable) {
        return service.list(q, pageable);
    }

    @GetMapping("/active")
    public List<MaterialTypeResponse> listActive() {
        return service.listActive();
    }

    @GetMapping("/{id}")
    public MaterialTypeResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public MaterialTypeResponse create(@Valid @RequestBody MaterialTypeRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MaterialTypeResponse update(@PathVariable UUID id, @Valid @RequestBody MaterialTypeRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MaterialTypeResponse patch(@PathVariable UUID id, @Valid @RequestBody MaterialTypeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID id) {
        service.deactivate(id);
    }
}
