Redstonepower::Application.routes.draw do
  get "/stats" => "stats#show"

  authenticated :user do
    root :to => 'home#index'
  end
  root :to => "home#index"
  devise_for :users
  resources :users
end
