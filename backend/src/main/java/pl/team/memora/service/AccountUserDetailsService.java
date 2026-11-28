package pl.team.memora.service;

import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.team.memora.model.User;
import pl.team.memora.repository.UserRepository;

@Service
public class AccountUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AccountUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        final User user = userRepository.findByName(username)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono użytkownika"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getName())
                .password(user.getPassword())
                .build();
    }
}
