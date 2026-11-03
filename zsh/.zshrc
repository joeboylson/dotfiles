# Ghostty machine picker: every new tab/split asks which machine to open on.
# Kept at the top so it shows before oh-my-zsh and nvm load. Runs only where
# ~/.config/machine-pick/machines.zsh exists, never inside ssh, and never in a
# shell started from an already-picked pane. MACHINE_PICKER=0 turns it off.
if [[ -o interactive && $TERM_PROGRAM == ghostty && -z $SSH_CONNECTION \
      && -z $MACHINE_PICKED && $MACHINE_PICKER != 0 \
      && -f $HOME/.config/machine-pick/machines.zsh ]]; then
  export MACHINE_PICKED=1
  _mp_target=$($HOME/.local/bin/machine-pick)
  [[ -n $_mp_target ]] && exec ssh $_mp_target
  unset _mp_target
fi

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="arrow"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete)
# Load only the plugins installed on this machine, so a missing one isn't an error.
_installed=()
for _p in $plugins; do
  [[ -d $ZSH/plugins/$_p || -d ${ZSH_CUSTOM:-$ZSH/custom}/plugins/$_p ]] && _installed+=$_p
done
plugins=($_installed)
unset _installed _p
source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

alias r="source ~/.zshrc"
alias x="exit"
alias c="clear"
alias @="cd ~/@"
alias gco="git checkout"

# go to projects folder 
alias projects="cd $HOME/@/1_Projects"

# flutter
export PATH="$PATH:$HOME/.config/flutter/bin"

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# poetry
export PATH="$PATH:$HOME/.local/bin"

if [[ $OSTYPE == darwin* ]]; then
  alias copy='pbcopy'
else
  alias copy='xclip -sel c'
fi

# opencode
export PATH="$HOME/.opencode/bin:$PATH"

# bun completions
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"



export PATH="$HOME/.local/bin:$HOME/.asdf/shims:$PATH"

# asdf version manager
if [ -f "$HOME/.asdf/asdf.sh" ]; then
  . "$HOME/.asdf/asdf.sh"
  fpath=(${ASDF_DIR}/completions $fpath)
  autoload -Uz compinit && compinit
  export PATH="$HOME/.asdf/installs/nodejs/22.15.0/bin:$PATH"
fi

export EDITOR=nvim
export VISUAL=nvim

# claude: asks for a session name when you start a new session yourself, so
# every session you start has one (claude-sessions lists only named sessions).
# Programs that run claude (Legion, hindsight) call the real binary, not this.
claude() {
  local -a base=(--verbose --add-dir $HOME/@)
  local arg
  local has_own_name_or_resume=0
  for arg in "$@"; do
    case $arg in
      -n|--name|--name=*|-r|--resume|--resume=*|-c|--continue|-p|--print|-h|--help|-v|--version)
        has_own_name_or_resume=1 ;;
    esac
  done
  local is_subcommand=0
  case $1 in
    agents|attach|auth|auto-mode|doctor|gateway|import|install|logs|mcp|plugin|plugins|purge|respawn|rm|setup-token|stop|kill|ultrareview|update|upgrade)
      is_subcommand=1 ;;
  esac
  if (( has_own_name_or_resume || is_subcommand )) || [[ ! -t 0 ]]; then
    command claude $base "$@"
    return
  fi
  local name=""
  while [[ -z ${name// } ]]; do
    read "name?session name: " || return 130
  done
  command claude $base --name "$name" "$@"
}

# Search and resume named Claude sessions
alias cs="claude-sessions"

# Machine-specific settings (project aliases, SDK paths, monitor layout) live in
# ~/.zshrc.local, which is not in the dotfiles repo. Sourced last so it wins.
[ -f "$HOME/.zshrc.local" ] && source "$HOME/.zshrc.local"
