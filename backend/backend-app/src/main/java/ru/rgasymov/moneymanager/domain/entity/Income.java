package ru.rgasymov.moneymanager.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "income")
@Data
@NoArgsConstructor
@SuperBuilder
public class Income {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "income_type_id")
  private IncomeType incomeType;

  @ManyToOne
  @JoinColumn(name = "accumulation_id")
  private Accumulation accumulation;

  private LocalDate date;

  private String description;

  private BigDecimal value;
}
