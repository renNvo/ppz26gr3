package pl.team.memora.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.team.memora.dto.RegisterRequest;
import pl.team.memora.dto.RegisterRespond;
import pl.team.memora.model.User;
import pl.team.memora.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterRespond register(RegisterRequest request) {
        if(userRepository.findByName(request.username()).isPresent()) {
            throw new IllegalArgumentException("Uzytkownik o tej nazwie istnieje");
        }

        User user = new User();

        user.setName(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));

        user = userRepository.save(user);

        return new RegisterRespond(
                user.getId(),
                user.getName(),
                "Uzytkownik zostal zarejestrowany"
        );
    }
}
