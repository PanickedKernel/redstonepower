class Role < ActiveRecord::Base
  has_and_belongs_to_many :users, :join_table => :users_roles
  belongs_to :resource, :polymorphic => true
  
  rails_admin do 
  configure :resource, :polymorphic_association         # Hidden
  configure :users, :has_and_belongs_to_many_association
  end

  scopify
end
