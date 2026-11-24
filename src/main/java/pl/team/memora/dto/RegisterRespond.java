package pl.team.memora.dto;

public record RegisterRespond(
        Long id,
        String username,
        String email,
        String token,
        String message
) {
}
