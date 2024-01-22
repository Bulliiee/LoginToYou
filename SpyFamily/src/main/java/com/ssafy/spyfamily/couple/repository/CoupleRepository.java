package com.ssafy.spyfamily.couple.repository;

import com.ssafy.spyfamily.couple.model.Couple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoupleRepository extends JpaRepository<Couple, Integer> {

}
