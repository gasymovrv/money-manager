package ru.rgasymov.moneymanager.domain.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
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

    @ToString.Exclude
    @Column(columnDefinition = "clob")
    private String picture;

    @ToString.Exclude
    private String email;

    @ToString.Exclude
    private String locale;

    @ToString.Exclude
    @Column(name = "last_visit")
    private LocalDateTime lastVisit;
}
