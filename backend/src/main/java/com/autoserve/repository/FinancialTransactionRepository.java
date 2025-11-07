package com.autoserve.repository;

import com.autoserve.entity.FinancialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {
    List<FinancialTransaction> findByDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FinancialTransaction f WHERE (:start IS NULL OR f.date >= :start) AND (:end IS NULL OR f.date <= :end)")
    Double sumAmountBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COUNT(f) FROM FinancialTransaction f WHERE (:start IS NULL OR f.date >= :start) AND (:end IS NULL OR f.date <= :end)")
    Long countBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
