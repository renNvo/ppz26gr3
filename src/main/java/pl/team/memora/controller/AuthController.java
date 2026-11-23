package pl.team.memora.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.team.memora.dto.LoginRequest;
import pl.team.memora.dto.LoginResponse;
import pl.team.memora.dto.RegisterRequest;
import pl.team.memora.dto.RegisterRespond;
import pl.team.memora.service.AuthService;
import pl.team.memora.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtService            = jwtService;
        this.authService           = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.username(),
                loginRequest.password()
        ));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(token);
    }

    @PostMapping("/register")
    public RegisterRespond register(@RequestBody RegisterRequest request) {
        IO.println("Register debug");
        return authService.register(request);
    }
}
