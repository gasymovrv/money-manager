package ru.rgasymov.moneymanager.util;

import java.util.ArrayList;
import java.util.List;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import ru.rgasymov.moneymanager.domain.dto.response.ErrorDto;

@UtilityClass
public class ErrorUtils {

  /**
   * Create error list from stacktrace.
   */
  public List<ErrorDto> getErrorsFromStack(Throwable error) {
    var errors = new ArrayList<ErrorDto>();
    while (error != null) {
      var errorDto = new ErrorDto(
          error.getClass().getName(),
          error.getMessage());
      errors.add(errorDto);
      error = error.getCause();
    }
    return errors;
  }

  public void logException(Exception ex, Logger log) {
    var message = ex.getMessage();
    if (StringUtils.isNotBlank(message)) {
      log.error("# " + message, ex);
    } else {
      log.error("# " + ex, ex);
    }
  }
}
