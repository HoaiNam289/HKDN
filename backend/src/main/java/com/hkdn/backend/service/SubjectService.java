package com.hkdn.backend.service;

import com.hkdn.backend.dto.SubjectRequest;
import com.hkdn.backend.dto.SubjectResponse;
import com.hkdn.backend.entity.Subject;
import com.hkdn.backend.exception.ConflictException;
import com.hkdn.backend.exception.ResourceNotFoundException;
import com.hkdn.backend.repository.SubjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class SubjectService {

    private final SubjectRepository subjects;

    public SubjectService(SubjectRepository subjects) {
        this.subjects = subjects;
    }

    @Transactional(readOnly = true)
    public Page<SubjectResponse> list(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return subjects.findAll(pageable).map(SubjectResponse::from);
        }
        String query = q.trim();
        return subjects.findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase(query, query, pageable)
                .map(SubjectResponse::from);
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> listActive() {
        return subjects.findByActiveTrueOrderByNameAsc().stream()
                .map(SubjectResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SubjectResponse get(UUID id) {
        return SubjectResponse.from(find(id));
    }

    @Transactional
    public SubjectResponse create(SubjectRequest request) {
        String code = normalizeCode(request.code());
        if (subjects.existsByCodeIgnoreCase(code)) {
            throw new ConflictException("Mã môn học đã tồn tại: " + code);
        }
        Subject subject = new Subject();
        subject.setCode(code);
        subject.setName(request.name().trim());
        subject.setDescription(trimToNull(request.description()));
        subject.setActive(request.active() == null || request.active());
        return SubjectResponse.from(subjects.save(subject));
    }

    @Transactional
    public SubjectResponse update(UUID id, SubjectRequest request) {
        Subject subject = find(id);
        String code = normalizeCode(request.code());
        if (subjects.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new ConflictException("Mã môn học đã tồn tại: " + code);
        }
        subject.setCode(code);
        subject.setName(request.name().trim());
        subject.setDescription(trimToNull(request.description()));
        if (request.active() != null) {
            subject.setActive(request.active());
        }
        return SubjectResponse.from(subjects.save(subject));
    }

    @Transactional
    public void deactivate(UUID id) {
        Subject subject = find(id);
        subject.setActive(false);
        subjects.save(subject);
    }

    private Subject find(UUID id) {
        return subjects.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học"));
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
