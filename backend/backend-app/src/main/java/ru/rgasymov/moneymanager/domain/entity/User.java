package ru.rgasymov.moneymanager.domain.entity;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class User implements Serializable {
  @Serial
  private static final long serialVersionUID = 1234567L;

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

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @Column(name = "last_visit")
  private LocalDateTime lastVisit;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @OneToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "current_account_id")
  private Account currentAccount;
}
