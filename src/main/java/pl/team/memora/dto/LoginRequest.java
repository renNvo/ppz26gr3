package pl.team.memora.dto;

public record LoginRequest(
        String username,
        String email,
        String password
) {
}
