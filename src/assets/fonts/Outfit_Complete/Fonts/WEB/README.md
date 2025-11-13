# Installing Webfonts
Follow these simple Steps.

## 1.
Put `outfit/` Folder into a Folder called `fonts/`.

## 2.
Put `outfit.css` into your `css/` Folder.

## 3. (Optional)
You may adapt the `url('path')` in `outfit.css` depends on your Website Filesystem.

## 4.
Import `outfit.css` at the top of you main Stylesheet.

```
@import url('outfit.css');
```

## 5.
You are now ready to use the following Rules in your CSS to specify each Font Style:
```
font-family: Outfit-Thin;
font-family: Outfit-ExtraLight;
font-family: Outfit-Light;
font-family: Outfit-Regular;
font-family: Outfit-Medium;
font-family: Outfit-SemiBold;
font-family: Outfit-Bold;
font-family: Outfit-ExtraBold;
font-family: Outfit-Black;
font-family: Outfit-Variable;

```
## 6. (Optional)
Use `font-variation-settings` rule to controll axes of variable fonts:
wght 100.0

Available axes:
'wght' (range from 100.0 to 900.0

