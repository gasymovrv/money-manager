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
@ToString(onlyExplicitlyIncluded = true)
public class User implements Serializable {
  @Serial
  private static final long serialVersionUID = 1234567L;

  @Id
  @ToString.Include
  private String id;

  @ToString.Include
  private String name;

  @Column(columnDefinition = "clob")
  private String picture;

  private String email;

  private String locale;

  @Column(name = "last_visit")
  private LocalDateTime lastVisit;

  @OneToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "current_account_id")
  private Account currentAccount;
}
