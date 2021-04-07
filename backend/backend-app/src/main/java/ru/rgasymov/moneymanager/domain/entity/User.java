package ru.rgasymov.moneymanager.domain.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User implements Serializable {
    @Id
    private String id;
    private String name;
    @Column(columnDefinition = "clob")
    private String picture;
    private String email;
    private String locale;
    @Column(name = "last_visit")
    private LocalDateTime lastVisit;
}
