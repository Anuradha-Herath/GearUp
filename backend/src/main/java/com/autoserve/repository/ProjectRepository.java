package com.autoserve.repository;

import com.autoserve.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Add custom queries if needed
}