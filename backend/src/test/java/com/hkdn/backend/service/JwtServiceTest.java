package com.hkdn.backend.service;

import com.hkdn.backend.entity.User;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.lang.reflect.Constructor;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void issuedTokenUsesHs256AndFifteenMinuteLifetime() throws Exception {
        SecretKey key = new SecretKeySpec(
            "test-only-secret-with-at-least-32-bytes".getBytes(StandardCharsets.UTF_8),
            "HmacSHA256");
        OctetSequenceKey jwk = new OctetSequenceKey.Builder(key)
            .algorithm(JWSAlgorithm.HS256)
            .build();
        JWKSource<SecurityContext> source = (selector, context) -> selector.select(new JWKSet(jwk));
        JwtService jwtService = new JwtService(
            new NimbusJwtEncoder(source),
            "educertify",
            Duration.ofMinutes(15));

        User user = testUser();
        String token = jwtService.issueAccessToken(user);

        JwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key)
            .macAlgorithm(MacAlgorithm.HS256)
            .build();
        Jwt decoded = decoder.decode(token);

        assertEquals("educertify", decoded.getClaimAsString("iss"));
        assertEquals(user.getId().toString(), decoded.getSubject());
        assertEquals(900L, jwtService.getAccessTokenTtlSeconds());
        assertTrue(decoded.getExpiresAt().isAfter(decoded.getIssuedAt()));
        assertEquals("issuer@example.com", decoded.getClaimAsString("email"));
    }

    private User testUser() throws Exception {
        Constructor<User> constructor = User.class.getDeclaredConstructor();
        constructor.setAccessible(true);

        User user = constructor.newInstance();
        user.setId(UUID.randomUUID());
        user.setEmail("issuer@example.com");
        user.setPasswordHash("test-only-hash");
        user.setFullName("Test Issuer");
        return user;
    }
}
