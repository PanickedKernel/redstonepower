class AddMinecraftUsernameToUsers < ActiveRecord::Migration
  def change
    add_column :users, :minecraft_username, :string
  end
end
