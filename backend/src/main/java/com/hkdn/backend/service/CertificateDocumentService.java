package com.hkdn.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.hkdn.backend.entity.Certificate;
import org.apache.pdfbox.cos.COSArray;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.cos.COSString;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class CertificateDocumentService {
    public byte[] pdf(Certificate certificate) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream(); PDDocument document = new PDDocument()) {
            document.addPage(new PDPage(PDRectangle.A4));
            try (PDPageContentStream stream = new PDPageContentStream(document, document.getPage(0))) {
                stream.beginText();
                stream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                stream.newLineAtOffset(72, 720);
                stream.showText("EduCertify Certificate");
                stream.setFont(PDType1Font.HELVETICA, 12);
                stream.newLineAtOffset(0, -36);
                stream.showText("Code: " + safe(certificate.getCode()));
                stream.newLineAtOffset(0, -22);
                stream.showText("Title: " + safe(certificate.getTitle()));
                stream.newLineAtOffset(0, -22);
                stream.showText("Recipient: " + safe(certificate.getRecipientName()));
                stream.newLineAtOffset(0, -22);
                stream.showText("Issuer: " + safe(certificate.getIssuerName()));
                stream.endText();
            }
            // Co dinh /ID theo ma chung chi: PDFBox mac dinh sinh /ID theo thoi gian hien tai,
            // khien moi lan tao PDF ra mot ma bam khac nhau va xac thuc luon that bai.
            UUID stableId = UUID.nameUUIDFromBytes(safe(certificate.getCode()).getBytes(StandardCharsets.UTF_8));
            byte[] idBytes = ByteBuffer.allocate(16)
                    .putLong(stableId.getMostSignificantBits())
                    .putLong(stableId.getLeastSignificantBits())
                    .array();
            COSArray idArray = new COSArray();
            idArray.add(new COSString(idBytes));
            idArray.add(new COSString(idBytes));
            document.getDocument().getTrailer().setItem(COSName.ID, idArray);

            document.save(out);
            return out.toByteArray();
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to generate certificate PDF", exception);
        }
    }

    public byte[] qr(String value) {
        try {
            BitMatrix matrix = new QRCodeWriter().encode(value, BarcodeFormat.QR_CODE, 320, 320);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to generate QR code", exception);
        }
    }

    private String safe(String value) {
        return value == null ? "" : value.replaceAll("[^\\x20-\\x7E]", "?");
    }
}
