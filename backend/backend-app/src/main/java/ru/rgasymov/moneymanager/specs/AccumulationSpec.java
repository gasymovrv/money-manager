package ru.rgasymov.moneymanager.specs;

import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.Accumulation_;
import ru.rgasymov.moneymanager.domain.entity.User_;

public class AccumulationSpec {
    public static Specification<Accumulation> filterByDate(LocalDate from, LocalDate to) {
        if (from != null && to != null) {
            return dateBetween(from, to);
        } else if (from != null) {
            return dateAfter(from);
        } else if (to != null) {
            return dateBefore(to);
        }
        throw new IllegalArgumentException("FROM or TO dates must not be null");
    }

    public static Specification<Accumulation> dateBetween(LocalDate from, LocalDate to) {
        return (claim, cq, cb) -> cb.between(
                claim.get(Accumulation_.date).as(LocalDate.class), from, to);
    }

    public static Specification<Accumulation> dateAfter(LocalDate from) {
        return (claim, cq, cb) -> cb.greaterThanOrEqualTo(claim.get(Accumulation_.date), from);
    }

    public static Specification<Accumulation> dateBefore(LocalDate to) {
        return (claim, cq, cb) -> cb.lessThanOrEqualTo(claim.get(Accumulation_.date), to);
    }

    public static Specification<Accumulation> userIdEq(String id) {
        return (claim, cq, cb) ->
                cb.equal(claim.get(Accumulation_.user).get(User_.id), id);
    }
}
