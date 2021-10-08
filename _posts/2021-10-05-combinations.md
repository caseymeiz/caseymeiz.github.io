---
layout: post
title:  "Counting"
date:   2021-10-05 11:24:04 -0400
scripts:
- combinations.js
---

### Permutations $$n!$$

#### Generating Permutations
A permutation is an arrangement of elements from a given set. We can create a permutation by repeatedly selecting an element from a set and inserting it into a sequence until all elements have been selected.

For example we have a set of letters $$\{a,b,c,d\}$$.

Select any element form $$\{a,b,c,d\} => (d,?, ?, ?)$$

Select any element form $$\{a,b,c\} => (d, a, ?, ?)$$

Select any element form $$\{b,c\} => (d, a, c, ?)$$

Select any element form $$\{b\} => (d, a, c, b)$$

#### Counting Permutations
In the first step of creating a sequence we had 4 choices for selecting a letter $$\{a,b,c,d\}$$ and in the second step we had 3 choices $$\{a,b,c\}$$ and so on. We can apply the [multiplication principle](https://en.wikipedia.org/wiki/Rule_of_product) to count all the number of permutations $$ 4 \times 3 \times 2 \times 1 = 24$$. Which is equivariant to $$4!$$.

In a more general sense if we have a set with $$n$$ elements then there are $$n!$$ permutations.



### K Permutations $$\frac{n!}{(n-k)!}$$
#### Generating K Permutations
This has a very similar process as generating a whole permutation except you stop when your sequence is of length k.

In the image below you can see permutations of length 4 are built from permutations of length 3 and those are built from permutations of length 2 and so on.

<div id="vis"></div>

#### Counting K Permutations 
Lets look at permutations of length 2 from $$\{a,b,c,d, e\}$$. We have 5 choices to select from for our first letter and 4 letters for our second letter. Thus $$ 5 \times 3 = 15$$ permutations of length 2. 

This looks very similar to factorial except we want to slice off the last part of the multiplication.

$$5! = 5 \times 4 \times 3 \times 2 \times 1$$

$$5! = (5 \times 4)(3 \times 2 \times 1)$$

To remove this last part we can divide by $$(3 \times 2 \times 1)$$ which is $$3!$$

$$\frac{(5 \times 4)(3 \times 2 \times 1)}{(3 \times 2 \times 1)} = \frac{5!}{3!} = \frac{5!}{(5-2)!}$$

In general:

$$\frac{n!}{(n-k)!}$$

### K Combinations $$\frac{n!}{k!(n-k)!}$$

Combinations slightly differ from k permutations. Combinations don't have the requirement of ordering or having a specific arrangement. For example $$(a,b,c)$$ is the same as $$(b,a,c)$$ but is different from $$(d,b,c)$$.

#### Counting K Combinations 
Since we only want one version of $$(a,b,c)$$ we can calculate the number of ways to permute these 3 values which is $$3!$$. There are always $$3!$$  ways to permute three values so it does not matter how large our set is. Eg. k = 3 combinations of elements in $$\{a,b,c,d\}$$ and $$\{a,b,c, d, e\}$$ as seen in the tables below.

By dividing $$k!$$ by the total number of k permutations we are left with the number of k combinations since it is only leaving the representatives of reach permutation. 

$$\frac{\frac{n!}{(n-k)!}}{k!} = \frac{n!}{k!(n-k)!}$$ 



<div id="comb4"></div>
<div id="comb5"></div>
