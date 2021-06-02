package ru.rgasymov.moneymanager.domain.entity;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import ru.rgasymov.moneymanager.domain.enums.AccountTheme;
import ru.rgasymov.moneymanager.domain.enums.Currency;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@SuperBuilder
public class Account {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @Enumerated(EnumType.STRING)
  private AccountTheme theme;

  @Enumerated(EnumType.STRING)
  private Currency currency;

  @ManyToOne
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @JoinColumn(name = "user_id")
  private User user;
}
