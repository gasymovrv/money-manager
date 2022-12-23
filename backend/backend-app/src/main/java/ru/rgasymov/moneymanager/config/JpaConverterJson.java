package ru.rgasymov.moneymanager.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;

@Converter(autoApply = true)
public class JpaConverterJson implements AttributeConverter<OperationResponseDto, String> {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(OperationResponseDto meta) {
    try {
      return objectMapper.writeValueAsString(meta);
    } catch (JsonProcessingException ex) {
      return null;
      // or throw an error
    }
  }

  @Override
  public OperationResponseDto convertToEntityAttribute(String dbData) {
    try {
      return objectMapper.readValue(dbData, OperationResponseDto.class);
    } catch (IOException ex) {
      // logger.error("Unexpected IOEx decoding json from database: " + dbData);
      return null;
    }
  }

}
