# Chapter 14

## Console display

```
Call SPMSG
DB   'Message text for console', 0
```

- inline message

## Get input

`GETYN:`

- Creates a prompt of ```(Y/N)?``` and waits for a response of "y" or "n" (case does not matter) or CTRL C.
- Uses buffered console input for responses, but only looks for first character, meaning that anything starting with a "y" or "n" works as the corresponding response.
