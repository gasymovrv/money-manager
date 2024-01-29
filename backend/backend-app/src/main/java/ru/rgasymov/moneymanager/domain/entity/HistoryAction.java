package ru.rgasymov.moneymanager.domain.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import ru.rgasymov.moneymanager.config.JpaConverterJson;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.enums.HistoryActionType;
import ru.rgasymov.moneymanager.domain.enums.OperationType;

@Entity
@Table(name = "history")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class HistoryAction {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @Fetch(FetchMode.JOIN)
  @JoinColumn(name = "account_id")
  private Account account;

  @Enumerated(EnumType.STRING)
  @Column(name = "action_type")
  private HistoryActionType actionType;

  @Enumerated(EnumType.STRING)
  @Column(name = "operation_type")
  private OperationType operationType;

  @Column(name = "modified_at")
  @Builder.Default
  private LocalDateTime modifiedAt = LocalDateTime.now();

  @Convert(converter = JpaConverterJson.class)
  @Column(name = "old_operation", columnDefinition = "character")
  private OperationResponseDto oldOperation;

  @Convert(converter = JpaConverterJson.class)
  @Column(name = "new_operation", columnDefinition = "character")
  private OperationResponseDto newOperation;
}