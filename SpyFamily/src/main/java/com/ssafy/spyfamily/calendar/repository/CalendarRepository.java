package com.ssafy.spyfamily.calendar.repository;

import com.ssafy.spyfamily.calendar.model.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {

    @Query("SELECT c FROM Calendar c WHERE c.coupleId = :coupleId")
    List<Calendar> findByCoupleId(Integer coupleId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Calendar c WHERE c.coupleId = :coupleId")
    void deleteByCoupleId(Integer coupleId);

}
