package ru.rgasymov.moneymanager.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name = "saving")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Saving {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "account_id")
  private Long accountId;

  private LocalDate date;

  @Column(name = "value_")
  private BigDecimal value;

  @Builder.Default
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @Fetch(FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "savingId", fetch = FetchType.LAZY)
  private List<Income> incomes = new ArrayList<>();

  @Builder.Default
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @Fetch(FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "savingId", fetch = FetchType.LAZY)
  private List<Expense> expenses = new ArrayList<>();
}
