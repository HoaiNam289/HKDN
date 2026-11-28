-- ============================================================================
-- V4: Mở rộng phân hệ Quản lý học liệu số (Nhật Thanh - Nhóm 1)
-- Mục đích:
--   1. Tạo bảng danh mục môn học (subjects) và loại học liệu (material_types)
--   2. Bổ sung thông tin tác giả, khóa ngoại danh mục và quy trình duyệt
--      vào bảng materials (giữ nguyên cột cũ, đảm bảo tương thích ngược)
-- ============================================================================

-- 1. Bảng Danh mục môn học (subjects)
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_subjects_code UNIQUE (code)
);

CREATE INDEX idx_subjects_active ON subjects(active);

-- 2. Bảng Danh mục loại học liệu (material_types)
CREATE TABLE material_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_material_types_code UNIQUE (code)
);

CREATE INDEX idx_material_types_active ON material_types(active);

-- 3. Mở rộng bảng materials (giữ nguyên cột subject và status cũ)
ALTER TABLE materials
    ADD COLUMN author VARCHAR(255),
    ADD COLUMN subject_id UUID,
    ADD COLUMN material_type_id UUID,
    ADD COLUMN review_status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
    ADD COLUMN reviewed_by UUID,
    ADD COLUMN reviewed_at TIMESTAMPTZ,
    ADD COLUMN reject_reason VARCHAR(500);

-- Các bản ghi cũ mặc định là APPROVED; các bản ghi mới tạo sau này mặc định là PENDING
ALTER TABLE materials
    ALTER COLUMN review_status SET DEFAULT 'PENDING';

-- Ràng buộc khóa ngoại và miền giá trị
ALTER TABLE materials
    ADD CONSTRAINT fk_materials_subject
        FOREIGN KEY (subject_id) REFERENCES subjects(id),
    ADD CONSTRAINT fk_materials_type
        FOREIGN KEY (material_type_id) REFERENCES material_types(id),
    ADD CONSTRAINT fk_materials_reviewer
        FOREIGN KEY (reviewed_by) REFERENCES users(id),
    ADD CONSTRAINT ck_materials_review_status
        CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED'));

-- Index hỗ trợ tìm kiếm, lọc và duyệt
CREATE INDEX idx_materials_subject_id ON materials(subject_id);
CREATE INDEX idx_materials_type_id ON materials(material_type_id);
CREATE INDEX idx_materials_review_status ON materials(review_status);
