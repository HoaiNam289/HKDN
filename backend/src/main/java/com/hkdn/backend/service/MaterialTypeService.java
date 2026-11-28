package com.hkdn.backend.service;

import com.hkdn.backend.dto.MaterialTypeRequest;
import com.hkdn.backend.dto.MaterialTypeResponse;
import com.hkdn.backend.entity.MaterialType;
import com.hkdn.backend.exception.ConflictException;
import com.hkdn.backend.exception.ResourceNotFoundException;
import com.hkdn.backend.repository.MaterialTypeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class MaterialTypeService {

    private final MaterialTypeRepository materialTypes;

    public MaterialTypeService(MaterialTypeRepository materialTypes) {
        this.materialTypes = materialTypes;
    }

    @Transactional(readOnly = true)
    public Page<MaterialTypeResponse> list(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return materialTypes.findAll(pageable).map(MaterialTypeResponse::from);
        }
        String query = q.trim();
        return materialTypes.findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase(query, query, pageable)
                .map(MaterialTypeResponse::from);
    }

    @Transactional(readOnly = true)
    public List<MaterialTypeResponse> listActive() {
        return materialTypes.findByActiveTrueOrderByNameAsc().stream()
                .map(MaterialTypeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MaterialTypeResponse get(UUID id) {
        return MaterialTypeResponse.from(find(id));
    }

    @Transactional
    public MaterialTypeResponse create(MaterialTypeRequest request) {
        String code = normalizeCode(request.code());
        if (materialTypes.existsByCodeIgnoreCase(code)) {
            throw new ConflictException("Mã loại học liệu đã tồn tại: " + code);
        }
        MaterialType type = new MaterialType();
        type.setCode(code);
        type.setName(request.name().trim());
        type.setDescription(trimToNull(request.description()));
        type.setActive(request.active() == null || request.active());
        return MaterialTypeResponse.from(materialTypes.save(type));
    }

    @Transactional
    public MaterialTypeResponse update(UUID id, MaterialTypeRequest request) {
        MaterialType type = find(id);
        String code = normalizeCode(request.code());
        if (materialTypes.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new ConflictException("Mã loại học liệu đã tồn tại: " + code);
        }
        type.setCode(code);
        type.setName(request.name().trim());
        type.setDescription(trimToNull(request.description()));
        if (request.active() != null) {
            type.setActive(request.active());
        }
        return MaterialTypeResponse.from(materialTypes.save(type));
    }

    @Transactional
    public void deactivate(UUID id) {
        MaterialType type = find(id);
        type.setActive(false);
        materialTypes.save(type);
    }

    private MaterialType find(UUID id) {
        return materialTypes.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại học liệu"));
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
