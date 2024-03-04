# Regex engine

This is a regex implementation using [Thompson's construction algorithm](https://en.wikipedia.org/wiki/Thompson%27s_construction#:~:text=In%20computer%20science%2C%20Thompson's%20construction,strings%20against%20the%20regular%20expression.).

This was done just for educational purpose and I don`t think you should use this in production environments.

Supported meta characters:

| Meta character | Description  |
| -------------- | ------------ |
| ?              | zero or one  |
| \*             | zero or more |
| \|             | alternate    |
| +              | one or more  |

You can see more informations about how to create your own regex engine [here](https://swtch.com/~rsc/regexp/regexp1.html) (I used this article as a reference).
