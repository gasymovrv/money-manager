package ru.rgasymov.moneymanager.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name = "saving")
@Data
@NoArgsConstructor
@SuperBuilder
public class Saving {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  private LocalDate date;

  private BigDecimal value;

  @Builder.Default
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @Fetch(FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "saving")
  private List<Income> incomes = new ArrayList<>();

  @Builder.Default
  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  @Fetch(FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "saving")
  private List<Expense> expenses = new ArrayList<>();
}
