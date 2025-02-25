<div align="center">

# math-exercices

Quiz-based math exercises using a Python terminal UI.

## ⭐ Idea
<div align="left">
I was inspired by Khan academy, I usually love this website but the lack of content there really pmo once, I understand that's it's a non-profit so I have no right to be mad, but after seeing that there were no exercices for base conversion for me, I decided to make my own since it can't be that hard.
<div align="center">

## 📺 Demo

[![Watch the video](https://img.youtube.com/vi/e3aad00e-7a24-4cf0-bbb9-2626dc1e6a25/maxresdefault.jpg)](https://github.com/user-attachments/assets/e3aad00e-7a24-4cf0-bbb9-2626dc1e6a25)

<div align="left">

- Navigate mcq answers -> `Up arrow key`, `Down arrow key`
- Confirm an answer -> `Enter`
- Yes/No answers -> `Y`, `N`
- Quit -> `Esc` (or select `N` when prompted to leave)


## 📂 Main Structure

```sh
math-exercices/
├── src/ # Main source code for exercises
│   ├── db/ # Database for all exercices and problems
│   │   ├── Basic Algebra/ # Algebra-related problems
│   │   │   ├── .../
│   │   ├── Number Theory/
│   │   │   ├── .../
│   │   ├── etc.../
│   ├── defs.py # Definitions (classes, functions)
├── main.py # Main program (small, most things on defs.py)
├── README.md # Project documentation and suggestions
├── CHANGELOG.md # TODO's and commits
├── requirements.txt # avoid environement conflicts (pip install -r requirements.txt)
├── ... # Other inumportant files you don't need to worry about


```
## 🚀 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/bimoware/math-exercices.git
   cd math-exercices
   ```
2. Install necessary dependencies as per the requirements.txt file (use `pip` if `pip3` doesn't work)
   ```sh
   pip3 install -r requirements.txt
   ```
3. Run the program (better on VSCODE terminal):
   ```sh
   python main.py
   ```

## ⭐ Stars History

<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="https://star-history.com/embed?secret=Z2hwX21DbUd4Q1dTSEVIS0JPdnlQRWNxT0pmRTNOVGJVZTBJTXNUag==#bimoware/math-exercices&Date" frameBorder="0"></iframe>

## 🤝 Contributing

See CHANGELOG.md TODO's if you want to know where to start.

1. Fork the repository
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes
   ```sh
   git commit -m "Add a new feature"
   ```
4. Push to **YOUR** branch
   ```sh
   git push origin feature-branch
   ```
5. Open a pull request detailing as much as possible your change (why, did you run into a problem before that needed this fix etc..)

## 📜 License

This project is licensed under the MIT License.
