package com.ssafy.spyfamily.user.controller;

import com.ssafy.spyfamily.user.model.User;
import com.ssafy.spyfamily.user.service.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController()
@RequestMapping(value = "/user", produces = "application/json")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, maxAge = 6000)
public class UserController {

    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    /**
     * 유저 정보 수정
     * @param user 수정해야할 유저 정보
     * @return 수정된 유저정보
     */
    @PutMapping("/update")
    public ResponseEntity<?> userUpdate(@RequestBody User user) {
        try {
            log.info("유저 정보 업데이트 시작");
            User new_user = userService.userUpdate(user);
            log.info("유저 정보 업데이트 성공");
            log.info(new_user.toString());

            return new ResponseEntity<User>(new_user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("유저 정보 업데이트 실패");
            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 이메일로 회원 정보 가져오기
     */
    @GetMapping("/info")
    public ResponseEntity<?> info(@RequestParam(name="email") String email) {
        User user = userService.getUserByEmail(email);

        if(user != null) {
            return new ResponseEntity<User>(user, HttpStatus.OK);
        }

        return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
    }

    /**
     * 회원 탈퇴
     */
    @DeleteMapping("/withdrawal")
    public ResponseEntity<?> userWithdrawal(@RequestParam Integer userId) {
        try {
            log.info("유저 삭제 들어옴");
            userService.withdrawal(userId);

            log.info("삭제 성공");
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("삭제 실패");
            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/password")
    public ResponseEntity<?> userUpdatePassword(@RequestParam Integer userId,
                                                @RequestParam String password) {
        try {
            log.info("비밀번호 수정");
            User new_user = userService.userUpdatePassword(userId, password);

            log.info("비밀번호 수정 성공");
            return new ResponseEntity<User>(new_user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("비밀번호 수정 실패");
            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 이메일의 회원이 입력한 비밀번호가 일치하는지 여부
     */
    @GetMapping("/verify/password")
    public ResponseEntity<?> verifyPassword(@RequestParam(name="email") String email,
                                            @RequestParam(name="password") String password) {

        // 파라미터 만들기
        Map<String, String> param = new HashMap<String, String>();
        param.put("email", email);
        param.put("password", password);
        
        // 로그인 로직 호출해서 유저 체크
        User user = userService.login(param);

        if(user != null) {
            return new ResponseEntity<Void>(HttpStatus.OK);
        }

        return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
