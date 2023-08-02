codecov:
    bot: "codecov-io"
    require_ci_to_pass: no

coverage:
  status:
    project:
      back-end:
        # Project must always have at least 83% coverage (by line)
        target: 83%
        # Whole-project test coverage is allowed to drop up to 5%. (For situtations where we delete code with full coverage)
        threshold: 7%
        flags:
          - back-end

      front-end:
        target: 48%
        threshold: 9%
        flags:
          - front-end

    patch: off

flags:
  back-end:
    paths:
      - enterprise/backend
      - shared/src
      - src/metabase
    carryforward: true

  front-end:
    paths:
      - enterprise/frontend
      - frontend
    carryforward: true
