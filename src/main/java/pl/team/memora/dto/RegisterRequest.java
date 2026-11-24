package pl.team.memora.dto;

public record RegisterRequest(
        String username,
        String email,
        String password
) {
}
