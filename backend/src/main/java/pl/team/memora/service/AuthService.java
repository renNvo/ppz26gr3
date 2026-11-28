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

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Hasło jest wymagane");
        }

        if (userRepository.findByName(request.username()).isPresent()) {
            throw new IllegalArgumentException("Użytkownik o tej nazwie już istnieje");
        }

        User user = new User();

        user.setName(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getName());

        return new RegisterRespond(
                user.getId(),
                user.getName(),
                token,
                "Użytkownik został zarejestrowany"
        );
    }
}
