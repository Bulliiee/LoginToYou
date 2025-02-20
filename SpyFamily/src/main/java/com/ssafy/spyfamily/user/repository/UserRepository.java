package com.ssafy.spyfamily.user.repository;

import com.ssafy.spyfamily.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    int countByEmail(String email);

    User findByEmail(String email);
    User findByUserId(Integer userId);

    @Transactional
    @Modifying
    void deleteByUserId(Integer userId);


}
