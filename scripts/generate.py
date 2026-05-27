def prob_at_least_one_run(n, k):
    probas = [0]

    keys = ["start", "final"] + ["p" + str(i) for i in range(1, k)] + ["f" + str(i) for i in range(1, k)]

    dp = dict((k, 0.0) for k in keys)
    dp["start"] = 1.0

    for step in range(1, n + 1):
        new_dp = dict((k, 0.0) for k in keys)
        new_dp["final"] = dp["final"]
        new_dp["p1"] += 0.5 * dp["start"]
        new_dp["f1"] += 0.5 * dp["start"] 
        for i in range(1, k):
            new_dp["f1"] += 0.5 * dp["p"+str(i)]
            new_dp["p1"] += 0.5 * dp["f"+str(i)]
            if i == k-1:
                new_dp["final"] += 0.5 * (dp["p"+str(i)] + dp["f"+str(i)])
            else:
                new_dp["p"+str(i+1)] += 0.5 * dp["p"+str(i)]
                new_dp["f"+str(i+1)] += 0.5 * dp["f"+str(i)]
        dp = new_dp
        probas.append(dp["final"])

    return probas

N = 200

probas = [prob_at_least_one_run(N, k) for k in range(2, 14)]

def pr(n, k):
    if k == 0:
        return 1
    elif n == 0:
        return 0
    elif k == 1:
        return 1
    else:
        return probas[k-2][n]

def thresholds(n):
    ro = 0
    ov = 0
    vo = 0
    or_ = 0
    for i in range(0, 13):
        if pr(n, i) > 0.99 and pr(n, i+1) <= 0.99:
            ro = i + 0.5
        if pr(n, i) > 0.95 and pr(n, i+1) <= 0.95:
            ov = i + 0.5
        if pr(n, i) >= 0.05 and pr(n, i+1) < 0.05:
            vo = i + 0.5
        if pr(n, i) >= 0.01 and pr(n, i+1) < 0.01:
            or_ = i + 0.5
    # print("plop", [pr(n, i) for i in range(0, 14)])
    return [ro, ov, vo, or_]

for i in range(2, 20):
    print(i, thresholds(i))
