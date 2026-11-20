#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Adaptive Mastery, FSRS v4.5 Scheduler & Path Recommender
100% Open-Source Mathematical Spaced Repetition & Readiness Engine
Zero Paid APIs | Pure Python / Standard Library
===================================================================
"""

import math
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional

# FSRS v4.5 default open-source weights
FSRS_WEIGHTS = [
    0.4072, 1.1829, 3.1262, 15.4722,
    7.2102, 0.5316, 1.0651, 0.0234,
    1.616, 0.1544, 1.0824, 1.9813,
    0.0953, 0.2975, 2.2042, 0.2407,
    2.9466, 0.5034, 0.6567,
]

# Difficulty-Ranked Certification Path Ladder (Tiers 1-5)
CERTIFICATION_TIER_LADDER: List[Dict[str, Any]] = [
    {"code": "CC", "name": "ISC2 Certified in Cybersecurity", "tier": 1, "level": "Foundational", "est_hours": 35, "prereqs": []},
    {"code": "A+", "name": "CompTIA A+", "tier": 1, "level": "Foundational", "est_hours": 60, "prereqs": []},
    {"code": "NETWORK+", "name": "CompTIA Network+", "tier": 1, "level": "Foundational", "est_hours": 55, "prereqs": ["A+"]},
    {"code": "SECURITY+", "name": "CompTIA Security+", "tier": 2, "level": "Associate", "est_hours": 65, "prereqs": ["NETWORK+"]},
    {"code": "SAA-C03", "name": "AWS Solutions Architect Associate", "tier": 2, "level": "Associate", "est_hours": 80, "prereqs": ["NETWORK+"]},
    {"code": "NIST", "name": "NIST CSF 2.0 Practitioner", "tier": 2, "level": "Associate", "est_hours": 45, "prereqs": ["CC"]},
    {"code": "GRC", "name": "Enterprise GRC & Risk IT", "tier": 2, "level": "Associate", "est_hours": 50, "prereqs": ["NIST"]},
    {"code": "CYSA+", "name": "CompTIA CySA+", "tier": 3, "level": "Professional", "est_hours": 75, "prereqs": ["SECURITY+"]},
    {"code": "CISA", "name": "ISACA CISA (28th Ed)", "tier": 3, "level": "Professional", "est_hours": 110, "prereqs": ["GRC"]},
    {"code": "CRISC", "name": "ISACA CRISC", "tier": 3, "level": "Professional", "est_hours": 100, "prereqs": ["GRC"]},
    {"code": "FIFA-AGENT", "name": "FIFA Football Agent License", "tier": 3, "level": "Professional", "est_hours": 85, "prereqs": []},
    {"code": "CCSP", "name": "ISC2 CCSP", "tier": 4, "level": "Specialist", "est_hours": 120, "prereqs": ["SAA-C03", "SECURITY+"]},
    {"code": "CISSP", "name": "ISC2 CISSP (10th Ed)", "tier": 4, "level": "Specialist", "est_hours": 150, "prereqs": ["SECURITY+", "CISA"]},
    {"code": "CISM", "name": "ISACA CISM", "tier": 4, "level": "Specialist", "est_hours": 120, "prereqs": ["CISA", "CRISC"]},
    {"code": "CGEIT", "name": "ISACA CGEIT", "tier": 5, "level": "Executive", "est_hours": 130, "prereqs": ["CISA", "CISM"]},
    {"code": "GSLC", "name": "GIAC Security Leadership (GSLC)", "tier": 5, "level": "Executive", "est_hours": 120, "prereqs": ["CISSP", "CISM"]},
]


@dataclass
class FSRSCardState:
    card_id: str
    stability: float = 0.0
    difficulty: float = 5.0
    reps: int = 0
    lapses: int = 0
    state: str = "new"  # new | learning | review | relearning
    last_review: Optional[str] = None
    due: Optional[str] = None


def retrievability(elapsed_days: float, stability: float) -> float:
    """FSRS forgetting curve: R(t, S) = (1 + t / (9 * S))^-1."""
    if stability <= 0:
        return 0.0
    return (1.0 + max(elapsed_days, 0.0) / (9.0 * stability)) ** -1.0


def schedule_fsrs_card(
    card: FSRSCardState,
    rating: int,
    now: Optional[datetime] = None,
    desired_retention: float = 0.90,
) -> Dict[str, Any]:
    """
    Schedules an FSRS v4.5 review given rating:
      1 = Again, 2 = Hard, 3 = Good, 4 = Easy.
    """
    if rating not in (1, 2, 3, 4):
        raise ValueError("FSRS rating must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy).")

    now_dt = now or datetime.now(timezone.utc)
    w = FSRS_WEIGHTS

    if card.reps == 0 or card.stability <= 0:
        new_stability = max(0.1, w[rating - 1])
        new_difficulty = min(10.0, max(1.0, w[4] - (rating - 3) * w[5]))
        new_state = "learning" if rating == 1 else "review"
        lapses = card.lapses + (1 if rating == 1 else 0)
    else:
        last_dt = datetime.fromisoformat(card.last_review) if card.last_review else now_dt
        elapsed = max(0.0, (now_dt - last_dt).total_seconds() / 86400.0)
        r = retrievability(elapsed, card.stability)

        # Update difficulty with mean reversion
        d_next = card.difficulty - w[6] * (rating - 3)
        new_difficulty = min(10.0, max(1.0, w[7] * w[4] + (1.0 - w[7]) * d_next))

        if rating == 1:
            # Lapse: stability drops
            new_stability = max(
                0.1,
                w[11]
                * (new_difficulty ** -w[12])
                * (((card.stability + 1.0) ** w[13]) - 1.0)
                * math.exp(w[14] * (1.0 - r)),
            )
            new_state = "relearning"
            lapses = card.lapses + 1
        else:
            hard_penalty = w[15] if rating == 2 else 1.0
            easy_bonus = w[16] if rating == 4 else 1.0
            s_inc = (
                math.exp(w[8])
                * (11.0 - new_difficulty)
                * (card.stability ** -w[9])
                * (math.exp(w[10] * (1.0 - r)) - 1.0)
                * hard_penalty
                * easy_bonus
            )
            new_stability = max(0.1, card.stability * (1.0 + s_inc))
            new_state = "review"
            lapses = card.lapses

    # Compute next interval for desired retention
    interval_days = max(1, round(9.0 * new_stability * (1.0 / desired_retention - 1.0)))
    if rating == 1:
        interval_days = 1

    due_dt = now_dt + timedelta(days=interval_days)
    updated = FSRSCardState(
        card_id=card.card_id,
        stability=round(new_stability, 4),
        difficulty=round(new_difficulty, 4),
        reps=card.reps + 1,
        lapses=lapses,
        state=new_state,
        last_review=now_dt.isoformat(),
        due=due_dt.isoformat(),
    )
    return {
        "card": asdict(updated),
        "interval_days": interval_days,
        "retrievability_at_due": desired_retention,
    }


def predict_exam_readiness(
    accuracy_rate: float,
    avg_stability_days: float,
    coverage_ratio: float,
    streak_days: int = 0,
) -> Dict[str, Any]:
    """
    Predicts certification exam readiness (0-100%) and ISACA-equivalent scaled score (200-800).
    Combines accuracy, FSRS memory stability, syllabus coverage, and consistency.
    """
    acc_score = min(1.0, max(0.0, accuracy_rate)) * 55.0
    stab_score = min(1.0, avg_stability_days / 21.0) * 20.0
    cov_score = min(1.0, max(0.0, coverage_ratio)) * 20.0
    streak_bonus = min(5.0, streak_days * 0.5)

    readiness_pct = round(min(100.0, acc_score + stab_score + cov_score + streak_bonus), 1)
    scaled_score = int(round(200 + (readiness_pct / 100.0) * 600))
    scaled_score = max(200, min(800, scaled_score))

    if readiness_pct >= 82:
        verdict = "Exam Ready — Schedule your official sitting."
    elif readiness_pct >= 68:
        verdict = "Near Ready — Focus FSRS reviews on weakest domains."
    elif readiness_pct >= 45:
        verdict = "Building Mastery — Complete core modules and daily drills."
    else:
        verdict = "Foundational Stage — Follow the Path-to-Success milestones."

    return {
        "readiness_percent": readiness_pct,
        "projected_scaled_score": scaled_score,
        "passing_threshold": 450,
        "verdict": verdict,
    }


def recommend_next_paths(
    completed_certs: List[str],
    mastery_by_cert: Optional[Dict[str, float]] = None,
    top_n: int = 3,
) -> List[Dict[str, Any]]:
    """
    Recommends the next optimal difficulty-ranked certifications based on
    completed prerequisites, current mastery, and progressive tier ascent.
    """
    completed_set = {c.upper() for c in completed_certs}
    mastery = {k.upper(): v for k, v in (mastery_by_cert or {}).items()}

    candidates = []
    for cert in CERTIFICATION_TIER_LADDER:
        code = cert["code"]
        if code in completed_set:
            continue
        prereqs = cert["prereqs"]
        prereqs_met = all(p in completed_set or mastery.get(p, 0.0) >= 70.0 for p in prereqs)
        current_mastery = mastery.get(code, 0.0)

        # Priority score: favor unlocked certs, lower tiers first, or in-progress certs
        score = 100.0 - (cert["tier"] * 12.0)
        if prereqs_met:
            score += 30.0
        if 10.0 <= current_mastery < 85.0:
            score += 25.0  # Momentum bonus for in-progress tracks

        candidates.append({
            **cert,
            "prereqs_met": prereqs_met,
            "current_mastery_percent": round(current_mastery, 1),
            "recommendation_score": round(score, 1),
        })

    candidates.sort(key=lambda x: (-x["recommendation_score"], x["tier"]))
    return candidates[:top_n]
