
############################################################
# BOOK EXAMPLE: SPURIOUS ASSOCIATION
# Shoe Size and Income: The Role of Sex
############################################################

# ----------------------------------------------------------
# 1. INTRODUCTION
# ----------------------------------------------------------

# Imagine observing that people with larger shoe sizes
# tend to have higher incomes.
#
# Does wearing larger shoes lead to a higher income?
# Does earning more money make someone's feet grow?
#
# Neither explanation makes sense.
#
# The apparent relationship is explained by a third
# variable: SEX.
#
# In this simplified example, men tend to have larger
# shoe sizes and higher average incomes than women.
#
# Consequently, when both groups are considered together,
# shoe size and income appear to be associated.
#
# This is called a SPURIOUS ASSOCIATION.
#
# The relationship is not caused by shoe size influencing
# income, or income influencing shoe size. Instead, both
# variables are associated with a third variable.


# ----------------------------------------------------------
# 2. LOAD PACKAGES
# ----------------------------------------------------------

library(ggplot2)
library(dplyr)
library(patchwork)


# ----------------------------------------------------------
# 3. SIMULATE DATA
# ----------------------------------------------------------

set.seed(123)

n <- 1000

data <- data.frame(
  sex = sample(c("Women", "Men"), n, replace = TRUE)
)

# Shoe size depends on sex

data$shoe_size <- ifelse(
  data$sex == "Men",
  rnorm(n, mean = 43, sd = 2),
  rnorm(n, mean = 38, sd = 2)
)

# Income depends on sex

data$income <- ifelse(
  data$sex == "Men",
  rnorm(n, mean = 55000, sd = 10000),
  rnorm(n, mean = 45000, sd = 10000)
)

data$sex <- factor(data$sex)


# ----------------------------------------------------------
# 4. ANALYSE THE RELATIONSHIP
# ----------------------------------------------------------

# Overall correlation

overall_correlation <- cor(
  data$shoe_size,
  data$income
)

cat("\nOVERALL CORRELATION:\n")
print(overall_correlation)


# Correlations within each group

group_correlations <- data %>%
  group_by(sex) %>%
  summarise(
    correlation = cor(shoe_size, income),
    n = n(),
    .groups = "drop"
  )

cat("\nCORRELATIONS WITHIN EACH GROUP:\n")
print(group_correlations)


# Compare average shoe size and income

group_means <- data %>%
  group_by(sex) %>%
  summarise(
    mean_shoe_size = mean(shoe_size),
    mean_income = mean(income),
    .groups = "drop"
  )

cat("\nGROUP MEANS:\n")
print(group_means)


# ----------------------------------------------------------
# 5. GRAPH 1: THE SPURIOUS ASSOCIATION
# ----------------------------------------------------------

# First, consider the relationship without distinguishing
# between men and women.
#
# The graph suggests that larger shoe sizes are associated
# with higher incomes.
#
# However, this apparent relationship is misleading.

p1 <- ggplot(
  data,
  aes(x = shoe_size, y = income)
) +
  geom_point(
    alpha = 0.35,
    color = "steelblue",
    size = 2
  ) +
  geom_smooth(
    method = "lm",
    se = TRUE,
    color = "red",
    linewidth = 1.2
  ) +
  labs(
    title = "A misleading relationship",
    subtitle = paste(
      "Correlation:",
      round(overall_correlation, 2)
    ),
    x = "Shoe size",
    y = "Annual income (€)",
    caption = paste(
      "Larger shoe sizes appear to be associated",
      "with higher incomes."
    )
  ) +
  theme_minimal(base_size = 13) +
  theme(
    plot.title = element_text(face = "bold"),
    plot.subtitle = element_text(color = "grey40")
  )

print(p1)


# ----------------------------------------------------------
# 6. GRAPH 2: REVEALING THE THIRD VARIABLE
# ----------------------------------------------------------

# Now distinguish between men and women.
#
# We can see that the two groups differ in both shoe size
# and average income.
#
# Within each group, however, there is no systematic
# relationship between shoe size and income.
#
# The apparent overall relationship is therefore explained
# by differences between the groups.

p2 <- ggplot(
  data,
  aes(
    x = shoe_size,
    y = income,
    color = sex
  )
) +
  geom_point(
    alpha = 0.4,
    size = 2
  ) +
  geom_smooth(
    method = "lm",
    se = FALSE,
    linewidth = 1.2
  ) +
  scale_color_manual(
    values = c(
      "Women" = "#D66BA0",
      "Men" = "#3677B8"
    )
  ) +
  labs(
    title = "The relationship explained by sex",
    subtitle = "The association largely disappears within each group",
    x = "Shoe size",
    y = "Annual income (€)",
    color = "Sex"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    plot.title = element_text(face = "bold"),
    legend.position = "bottom"
  )

print(p2)


# ----------------------------------------------------------
# 7. GRAPH 3: THE CAUSAL DIAGRAM
# ----------------------------------------------------------

# The actual causal structure in this simulation:
#
#                  SEX
#                 /   \
#                v     v
#          SHOE SIZE  INCOME
#
# Sex influences both shoe size and income.
#
# There is NO causal arrow between shoe size and income.
#
# The association between the two variables is spurious.

causal_graph <- ggplot() +

  # Sex node

  annotate(
    "label",
    x = 2,
    y = 3,
    label = "SEX",
    size = 6,
    fontface = "bold",
    fill = "#DCEFE5",
    color = "#176B4B",
    label.size = 0.8
  ) +

  # Shoe size node

  annotate(
    "label",
    x = 0.8,
    y = 1,
    label = "SHOE SIZE",
    size = 5,
    fontface = "bold",
    fill = "#E2EAF7",
    color = "#315E91",
    label.size = 0.8
  ) +

  # Income node

  annotate(
    "label",
    x = 3.2,
    y = 1,
    label = "INCOME",
    size = 5,
    fontface = "bold",
    fill = "#E2EAF7",
    color = "#315E91",
    label.size = 0.8
  ) +

  # Arrow from sex to shoe size

  annotate(
    "segment",
    x = 1.8,
    y = 2.75,
    xend = 0.95,
    yend = 1.35,
    linewidth = 1.2,
    color = "#21966A",
    arrow = arrow(length = unit(0.25, "cm"))
  ) +

  # Arrow from sex to income

  annotate(
    "segment",
    x = 2.2,
    y = 2.75,
    xend = 3.05,
    yend = 1.35,
    linewidth = 1.2,
    color = "#21966A",
    arrow = arrow(length = unit(0.25, "cm"))
  ) +

  annotate(
    "text",
    x = 2,
    y = 2,
    label = "No direct causal relationship",
    size = 4,
    color = "grey35"
  ) +

  coord_cartesian(
    xlim = c(0, 4),
    ylim = c(0.5, 3.5)
  ) +

  labs(
    title = "The actual causal structure",
    subtitle = "Sex is the common cause of both variables"
  ) +

  theme_void(base_size = 13) +

  theme(
    plot.title = element_text(
      face = "bold",
      hjust = 0.5,
      size = 15
    ),
    plot.subtitle = element_text(
      hjust = 0.5,
      color = "grey40"
    )
  )

print(causal_graph)


# ----------------------------------------------------------
# 8. COMBINE THE GRAPHS
# ----------------------------------------------------------

# Present the misleading relationship, the explanation,
# and the causal structure together.

combined_plot <- (p1 | p2) +
  plot_annotation(
    title = "A Spurious Association: Shoe Size and Income",
    subtitle = paste(
      "How a third variable can create a misleading",
      "statistical relationship"
    ),
    theme = theme(
      plot.title = element_text(
        size = 17,
        face = "bold"
      ),
      plot.subtitle = element_text(size = 12)
    )
  )

print(combined_plot)


# ----------------------------------------------------------
# 9. SAVE THE FIGURES
# ----------------------------------------------------------

ggsave(
  "spurious_association_shoe_size_income.png",
  combined_plot,
  width = 14,
  height = 11,
  dpi = 300
)

ggsave(
  "causal_diagram.png",
  causal_graph,
  width = 8,
  height = 5,
  dpi = 300
)


# ----------------------------------------------------------
# 10. EXPLANATION FOR THE BOOK
# ----------------------------------------------------------

cat("

========================================================
BOOK EXPLANATION
========================================================

A SPURIOUS RELATIONSHIP: SHOE SIZE AND INCOME

Imagine observing a dataset in which people with larger
shoe sizes tend to have higher incomes.

At first glance, this might suggest that shoe size and
income are somehow related.

However, consider whether either variable could plausibly
cause the other.

It is difficult to argue that wearing larger shoes
increases one's earning potential, or that earning more
money causes one's feet to grow.

The apparent relationship has a different explanation:
sex.

In our simplified example, men tend to have larger shoe
sizes and higher average incomes than women. When both
groups are considered together, these differences create
an apparent association between shoe size and income.

Once we distinguish between men and women, the relationship
largely disappears. The association was therefore not
evidence of a causal relationship between shoe size and
income.

Instead, it was a spurious association arising because
both variables were related to a third variable.

IMPORTANT TAKEAWAY:

Two variables can be statistically associated without
one causing the other. A third variable may explain why
they appear to be related.

========================================================

")


# ----------------------------------------------------------
# 11. FINAL METHODOLOGICAL NOTE
# ----------------------------------------------------------

# This is a deliberately simplified teaching example.
#
# The simulation assumes that shoe size and income are
# independently generated within each sex.
#
# Therefore, there is no causal effect of shoe size on
# income, and no causal effect of income on shoe size.
#
# The overall association arises entirely from differences
# between the two groups.
#
# This illustrates why observing a statistical association
# alone is insufficient to establish causality.
#
# Note: The example represents a hypothetical data-generating
# process, not a universal empirical claim about sex and income.
