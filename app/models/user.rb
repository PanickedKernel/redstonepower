class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :role_ids, :as => :admin
  attr_accessible :name, :email, :password, :password_confirmation, :remember_me, :minecraft_username
 
  validate :minecraft_premium
  validates_format_of :email, :with  => Devise.email_regexp, :allow_blank => true, :if => :email_changed?
  validates_uniqueness_of    :email,     :case_sensitive => false, :allow_blank => true, :if => :email_changed?
  validates_presence_of :password, :on=>:create
  validates_confirmation_of :password, :on=>:create
  validates_length_of :password, :within => Devise.password_length, :allow_blank => true

  private
  def minecraft_premium
    require 'open-uri'
    url = "https://minecraft.net/haspaid.jsp?user="
    minecraft_validation_url = url + minecraft_username
    is_username_premium = open(minecraft_validation_url).read
    errors.add(:minecraft_username, minecraft_username + " is not a premium minecraft account") unless is_username_premium == "true"
  end
end
