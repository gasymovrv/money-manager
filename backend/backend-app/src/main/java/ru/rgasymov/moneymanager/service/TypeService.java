package ru.rgasymov.moneymanager.service;

import java.util.Set;

public interface TypeService<T, R> {

  Set<R> findAll();

  R create(T dto);

  void delete(Long id);
}
