package ru.rgasymov.moneymanager.service;

import java.util.Set;

public interface TypeService<T, R> {

    R create(T dto);

    void delete(Long id);

    Set<R> findAll();
}
