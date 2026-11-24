package pl.team.memora.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.team.memora.dto.RegisterRequest;
import pl.team.memora.dto.RegisterRespond;
import pl.team.memora.model.User;
import pl.team.memora.repository.UserRepository;

@Service
public class AuthService {

    private final JwtService      jwtService;
    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtService      = jwtService;
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterRespond register(RegisterRequest request) {
        if (request.username() == null || request.username().isBlank()) {
            throw new IllegalArgumentException("Nazwa użytkownika jest wymagana");
        }

        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Adres email jest wymagany");
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Hasło jest wymagane");
        }

        if (userRepository.findByName(request.username()).isPresent()) {
            throw new IllegalArgumentException("Użytkownik o tej nazwie już istnieje");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Użytkownik o tym adresie email już istnieje");
        }

        User user = new User();

        user.setName(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getName());

        return new RegisterRespond(
                user.getId(),
                user.getName(),
                user.getEmail(),
                token,
                "Użytkownik został zarejestrowany"
        );
    }
}
