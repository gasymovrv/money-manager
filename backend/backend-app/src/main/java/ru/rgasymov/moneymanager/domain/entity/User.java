package ru.rgasymov.moneymanager.domain.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@SuperBuilder
public class User {
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
