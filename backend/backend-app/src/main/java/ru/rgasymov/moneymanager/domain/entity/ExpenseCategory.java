package ru.rgasymov.moneymanager.domain.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "expense_category")
@Getter
@ToString(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class ExpenseCategory extends BaseOperationCategory {
}
